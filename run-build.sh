clear
cat banner.txt

if [ -d "./public" ] 
then
  cd ./public/
  rm -rf *
  cd ..
else
  echo "Info: ./public directory doesn't exist yet"
fi

if [ ! -d "node_modules" ]; then
  echo "Error: no node_modules folder found, please execute 'run-prep.sh first"
  exit
fi

export NODE_OPTIONS=--openssl-legacy-provider
npm run build
