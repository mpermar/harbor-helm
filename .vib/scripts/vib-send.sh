#! /bin/bash

while test $# -gt 0; do
  case "$1" in
    -h|--help)
      echo "Sends a pipeline to VIB"
      echo " "
      echo "./vib.sh [options]"
      echo " "
      echo "options:"
      echo "-h, --help           Show brief help"
      echo "--pipeline=PIPELINE  JSON file with VIB pipeline"
      exit 0
      ;;
    --pipeline*)
      pipeline=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    *)
      break
      ;;
  esac
done

function send {

  csp_token
  curl -vs -o /dev/null -H "Content-Type: application/json" -X POST -d @"$pipeline" -H "Authorization: Bearer $BEARER_TOKEN" "${VIB_PUBLIC_URL}/v1/pipelines" >curl-output.txt 2>&1
  EXECUTION_GRAPH_URI="${VIB_PUBLIC_URL}$(cat curl-output.txt | grep location: | awk 'NF>1{print $NF}' | sed 's/.$//')"
  if [ -z "$EXECUTION_GRAPH_URI" ]; then 
    printf "Failed to send pipeline to $VIB_PUBLIC_URL\n"
    exit 1
  fi
  echo $EXECUTION_GRAPH_URI
}

function csp_token {

  BEARER_TOKEN=$(curl -s -H 'Content-Type: application/x-www-form-urlencoded' -X POST -d "grant_type=refresh_token&api_token=$CSP_API_TOKEN" "$CSP_API_URL/csp/gateway/am/api/auth/api-tokens/authorize" | jq -r .access_token)
  if [ -z "$BEARER_TOKEN" ]; then 
    printf "Could not fetch bearer token from $CSP_API_URL\n"
    exit 1
  fi
}

send