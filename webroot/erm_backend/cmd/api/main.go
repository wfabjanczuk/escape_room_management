package main

const apiName = "Escape Room Management API"
const apiVersion = "1.0.0"

func main() {
	newApplication().resetDatabase().start()
}
