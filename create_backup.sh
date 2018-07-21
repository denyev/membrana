#! /usr/bin/env bash

BACKUP_NAME="membrana"
BACKUP_PATH="${HOME}/_Backups/${BACKUP_NAME}"
CURRENT_DATE=$(date +"%F")
COUNT=$(ls -1 ${BACKUP_PATH}/${BACKUP_NAME}_${CURRENT_DATE}* | wc -l )

nice -n 19 ionice -c3 \
tar -czvf ${BACKUP_PATH}/${BACKUP_NAME}_${CURRENT_DATE}_$((${COUNT} + 1)).tgz ../${BACKUP_NAME} \
--exclude=node_modules --exclude=.idea --exclude=.git --exclude='*.psd' --exclude='*lock*'
