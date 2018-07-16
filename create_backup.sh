#! /usr/bin/env bash

nice -n 19 ionice -c3 tar -czvf ${HOME}/_Backups/membrana/membrana_2018-07-16-1.tgz ../membrana --exclude=node_modules --exclude=.idea --exclude=.git --exclude='*.psd' --exclude='*lock*'
