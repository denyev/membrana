#! /usr/bin/env bash

nice -n 19 ionice -c3 rsync  --progress --stats --bwlimit=1000 -e="ssh -p 22" -aAhHvX \
${HOME}/projects/membrana/dist/public/* \
strogg@vh170.timeweb.ru:~/membrana/public_html/
