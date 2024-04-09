#!/bin/bash

#create our working directory if it doesnt exist
DIR="/var/www/qlcc-fe"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  sudo mkdir ${DIR}
fi
