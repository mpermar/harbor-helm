#! /bin/bash

while test $# -gt 0; do
  case "$1" in
    -h|--help)
      echo "Polling execution graph for status"
      echo " "
      echo "./vib.sh [options]"
      echo " "
      echo "options:"
      echo "-h, --help           Show brief help"
      echo "--url=URL            Execution graph to check"
      echo "--interval=INTERVAL  Interval between each call, in seconds"
      echo "--timeout=TIMEOUT    Timeout before stop polling, in seconds"
      echo "--phase=PHASE        Execution graph phase."
      echo "--action=ACTION      Execution graph action id"
      exit 0
      ;;
    --url*)
      url=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    --interval*)
      interval=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    --timeout*)
      timeout=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    --phase*)
      phase=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    --action*)
      action=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    *)
      break
      ;;
  esac
done

function check {
  while true;
  do
    CURRENT_TIME=$(date +%s)
    ELAPSED=$(( CURRENT_TIME - START_TIME ))
    if (( ELAPSED > $timeout)); then
        echo "VIB checking has timed out after $timeout seconds. Exiting."
        return 1;
    fi
    
    csp_token
    curl -s -H "Content-Type: application/json" -H "Authorization: Bearer ${BEARER_TOKEN}" "${url}" > output.json

    actionStatus=$(action="$action" phase="$phase" jq -r '.tasks[] | select( (.action_id==env.action) and (.phase==env.phase)).status' output.json)
    echo "Status for action $action is $actionStatus"
    if [ "$actionStatus" = "SUCCEEDED" ]; then
      exit 0;
    else 
        if [[ "$actionStatus" == "FAILED" || "$actionStatus" == "SKIPPED" ]]; then
            exit 1;
        fi
    fi
    sleep $interval;
  done
}

function csp_token {

  if [ "$BEARER_TOKEN" != "null" ]; then
    echo "Bearer token already exists. Checking expiration."        
    ELAPSED=$(( CURRENT_TIME - GENERATED_TIME ))
        
    if (( ELAPSED < 600)); then
      echo "Valid token already exists"
      return 0;
    fi
  fi

  BEARER_TOKEN=$(curl -s -H 'Content-Type: application/x-www-form-urlencoded' -X POST -d "grant_type=refresh_token&api_token=$CSP_API_TOKEN" "$CSP_API_URL/csp/gateway/am/api/auth/api-tokens/authorize" | jq -r .access_token)
  GENERATED_TIME=$(date +%s)
  if [ -z "$BEARER_TOKEN" ]; then 
    printf "Could not fetch bearer token from $CSP_API_URL\n"
    exit 1
  fi
}

printf "\nRunning VIB on '${url%\?*}' every $interval seconds, with a $timeout seconds timeout, until action $action in phase $phase is done.\n"
START_TIME=$(date +%s)
check