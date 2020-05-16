package proto

//go:generate rm -rf ./api/swagger
//go:generate mkdir -p ./api/swagger
//go:generate rm -rf ./go
//go:generate mkdir ./go

//go:generate protoc -I=../vendor/github.com/golang/protobuf/proto -I=./grpc-gateway/third_party/googleapis -I=../vendor/github.com/grpc-ecosystem/grpc-gateway -I=. --go_out=plugins=grpc:./go --grpc-gateway_out=logtostderr=true:./go -I=. ./v1.proto

//go:generate protoc -I=./grpc-gateway/third_party/googleapis -I=../vendor/github.com/grpc-ecosystem/grpc-gateway -I=. --swagger_out=logtostderr=true,allow_merge=true,merge_file_name=todos:./api/swagger ./v1.proto

//go:generate go run
