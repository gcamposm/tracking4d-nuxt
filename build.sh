set -ex
# SET THE FOLLOWING VARIABLES
USERNAME=username
IMAGE=tracking4d-nuxt
docker build -t $USERNAME/$IMAGE:latest .
