
set -euo pipefail

RENDER_API="https://api.render.com/v1"


GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' 

info()    { echo -e "${YELLOW}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }


check_env() {
  local var_name="$1"
  if [[ -z "${!var_name:-}" ]]; then
    error "Environment variable '$var_name' is not set."
    exit 1
  fi
}

check_env RENDER_API_KEY
check_env RENDER_SERVER_SERVICE_ID
check_env RENDER_CLIENT_SERVICE_ID


trigger_deploy() {
  local service_label="$1"
  local service_id="$2"

  info "Triggering deploy for ${service_label} (${service_id}) …"

  local response
  response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Authorization: Bearer ${RENDER_API_KEY}" \
    -H "Content-Type: application/json" \
    "${RENDER_API}/services/${service_id}/deploys" \
    -d '{"clearCache":false}')

  local http_code
  http_code=$(echo "$response" | tail -n1)
  local body
  body=$(echo "$response" | head -n -1)

  if [[ "$http_code" -ne 201 ]]; then
    error "Failed to trigger deploy for ${service_label}. HTTP ${http_code}"
    error "Response: ${body}"
    exit 1
  fi

  local deploy_id
  deploy_id=$(echo "$body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  success "${service_label}: deploy triggered (deploy ID: ${deploy_id})"
  echo "$deploy_id"
}


wait_for_deploy() {
  local service_label="$1"
  local service_id="$2"
  local deploy_id="$3"
  local max_wait=600   
  local interval=15
  local elapsed=0

  info "Waiting for ${service_label} deploy to complete …"

  while [[ $elapsed -lt $max_wait ]]; do
    local response
    response=$(curl -s \
      -H "Authorization: Bearer ${RENDER_API_KEY}" \
      "${RENDER_API}/services/${service_id}/deploys/${deploy_id}")

    local status
    status=$(echo "$response" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

    case "$status" in
      live)
        success "${service_label}: deploy succeeded ✓"
        return 0
        ;;
      deactivated|canceled)
        error "${service_label}: deploy ended with status '${status}'"
        return 1
        ;;
      build_failed|update_failed|pre_deploy_failed)
        error "${service_label}: deploy failed (${status})"
        return 1
        ;;
      *)
        info "${service_label}: status = ${status} (${elapsed}s elapsed) …"
        ;;
    esac

    sleep "$interval"
    elapsed=$(( elapsed + interval ))
  done

  error "${service_label}: timed out after ${max_wait}s"
  return 1
}


main() {
  echo "============================================="
  echo "  CarRental – Render Deployment"
  echo "============================================="


  server_deploy_id=$(trigger_deploy "Server (Node/Express)" "$RENDER_SERVER_SERVICE_ID")
  client_deploy_id=$(trigger_deploy "Client (React/Vite)"   "$RENDER_CLIENT_SERVICE_ID")


  wait_for_deploy "Server" "$RENDER_SERVER_SERVICE_ID" "$server_deploy_id"
  wait_for_deploy "Client" "$RENDER_CLIENT_SERVICE_ID" "$client_deploy_id"

  echo ""
  success "All services deployed successfully 🚀"
}

main "$@"
