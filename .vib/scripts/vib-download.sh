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
      echo "--url=URL            Execution graph to download"
      exit 0
      ;;
    --url*)
      url=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    --output*)
      output=`echo $1 | sed -e 's/^[^=]*=//g'`
      shift
      ;;
    *)
      break
      ;;
  esac
done

function download {
    csp_token
    mkdir "$output"
    filename="$output"/execution_graph-"$GITHUB_SHA".json
    report="$output"/execution_graph-"$GITHUB_SHA"-report.json
    curl -s -H "Content-Type: application/json" -H "Authorization: Bearer ${BEARER_TOKEN}" "${url}" > "$filename"
    curl -s -H "Content-Type: application/json" -H "Authorization: Bearer ${BEARER_TOKEN}" "${url}/report" > "$report"
    for task in $(jq -r '.tasks[].task_id' $filename); do
      taskname=$(action="$task" jq -r '.tasks[] | select(.task_id==env.action).action_id' $filename)
      lowtime=${task:0:8}
      taskurl="${url}/tasks/$task/logs/raw"
      taskPublicUrl=$(echo $taskurl | sed -e "s/cp.bromelia.vmware.com/cp.production.k.bromelia.bitnami.net/g")
      echo "Fetching logs for task ${taskname} from ${taskPublicUrl}"
      curl -s -H "Content-Type: application/json" -H "Authorization: Bearer ${BEARER_TOKEN}" "${taskurl}" > "$output/$taskname-$lowtime-logs.txt"
    done
}

function csp_token {

  BEARER_TOKEN=$(curl -s -H 'Content-Type: application/x-www-form-urlencoded' -X POST -d "grant_type=refresh_token&api_token=$CSP_API_TOKEN" "$CSP_API_URL/csp/gateway/am/api/auth/api-tokens/authorize" | jq -r .access_token)
}

download