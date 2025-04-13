#!/bin/sh

set -e

RUN_DIR=$(pwd)

SCRIPT_DIR=$(
  cd $(dirname "$0")
  pwd
)

clear() {
  echo "Limpando a pasta dist..."
  rm -rf ./dist/*
}

tsc() {
  echo "Compilando Typescript..."
  ./node_modules/.bin/tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json
}

copy() {
  echo "Copiando package.json para dist..."
  cp ./package.json ./dist/package.json
  cp ./yarn.lock ./dist/yarn.lock
}

install() {
  echo "Instalando dependências na pasta dist..."
  cd ./dist
  yarn --freeze-lock-file --production
  yarn cache clean --force
  cd ..
}

compile() {
  clear
  tsc
  copy
  install
}

start() {
  cd "$SCRIPT_DIR" && cd ..
  compile
  cd "$RUN_DIR"
}

start
