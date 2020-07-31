set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=gcamposg
IMAGE=tracking4d-nuxt
docker build -t $USERNAME/$IMAGE:latest .
