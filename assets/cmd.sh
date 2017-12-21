#!/bin/sh
top -bn1 | grep load | awk '{printf "CPU Load: %.2f\n", $(NF-2)}'
free -m | awk 'NR==2{printf "Memory Usage: %s/%sMB (%.2f%%)\n", $3,$2,$3*100/$2 }'
df -h | awk '$NF=="/"{printf "Disk Usage: %d/%dGB (%s)\n", $3,$2,$5}'

# d1=$(date --date="-1 min" "+%d/%b/%Y:%H:%M:%S")
# d2=$(date "+%d/%b/%Y:%H:%M:%S")
# while read line; do
#     [[ $line > $d1 && $line < $d2 || $line =~ $d2 ]] && echo $line
# done

# awk -v d1=$(date --date="-1 min" "+%d/%b/%Y:%H:%M:%S") -v d2=$(date "+%d/%b/%Y:%H:%M:%S") '$0 > d1 && $0 < d2 || $0 ~ d2' /var/log/apache2/access.log

# d1=$(date --date="-1 minute" "+%d\/%b\/%Y:%H:%M:%S");d2=$(date "+%d\/%b\/%Y:%H:%M:%S");sed -n '/17\/Jun\/2017:13:39:54/ , /18\/Jun\/2017:10:50:28/ p' log
# awk 'substr($0,1,20)>="17/Jun/2017:13:39:55" && substr($0,1,20)<="18/Jun/2017:10:51:28"' < log| wc -l