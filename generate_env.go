package main

import (
	"bufio"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"strings"
)

const DockerComposeEnv = "/.env"
const BackendEnv = "/webroot/erm_backend/.env"

func getBackendEnvKeys() []string {
	return []string{"ENVIRONMENT", "PORT", "DSN", "JWT_SECRET"}
}

func getDockerComposeEnvKeys() []string {
	return []string{"POSTGRES_USER", "POSTGRES_PASSWORD"}
}

func getPublicVariables() map[string]string {
	return map[string]string{
		"DB_HOST":  "erm_database",
		"DB_PORT":  "5432",
		"DB_NAME":  "erm",
		"API_PORT": "9000",
	}
}

func main() {
	path, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	eg := envGenerator{
		path:      path,
		seeds:     make(map[string]string),
		variables: make(map[string]string),
		reader: commandLineReader{
			bufio.NewReader(os.Stdin),
		},
	}

	eg.readInput()
	eg.generateEnvFiles()
}

type commandLineReader struct {
	reader *bufio.Reader
}

func (clr *commandLineReader) readLine() string {
	line, _ := clr.reader.ReadString('\n')

	line = strings.Replace(line, "\r", "", -1)
	line = strings.Replace(line, "\n", "", -1)

	return line
}

type envGenerator struct {
	path      string
	seeds     map[string]string
	variables map[string]string
	reader    commandLineReader
}

func (eg *envGenerator) readInput() {
	eg.readVariable("ENVIRONMENT", "environment")
	eg.readVariable("POSTGRES_USER", "database username")
	eg.readVariable("POSTGRES_PASSWORD", "database password")
	eg.readSeed("JWT_KEY", "JWT secret key")
	eg.readSeed("JWT_DATA", "JWT secret data")
}

func (eg *envGenerator) readVariable(key, label string) {
	fmt.Println(fmt.Sprintf("Enter %s: ", label))
	eg.variables[key] = eg.reader.readLine()
}

func (eg *envGenerator) readSeed(key, label string) {
	fmt.Println(fmt.Sprintf("Enter %s: ", label))
	eg.seeds[key] = eg.reader.readLine()
}

func (eg *envGenerator) generateEnvFiles() {
	eg.generateVariables()
	eg.generateBackendEnv()
	eg.generateDockerComposeEnv()
}

func (eg *envGenerator) generateVariables() {
	publicVariables := getPublicVariables()
	eg.variables["PORT"] = publicVariables["API_PORT"]
	eg.variables["DB_HOST"] = publicVariables["DB_HOST"]
	eg.variables["DB_PORT"] = publicVariables["DB_PORT"]
	eg.variables["DB_NAME"] = publicVariables["DB_NAME"]

	eg.generateJwtSecret()
	eg.generateDsn()
}

func (eg *envGenerator) generateJwtSecret() {
	h := hmac.New(sha256.New, []byte(eg.seeds["JWT_KEY"]))
	h.Write([]byte(eg.seeds["JWT_DATA"]))
	eg.variables["JWT_SECRET"] = hex.EncodeToString(h.Sum(nil))
}

func (eg *envGenerator) generateDsn() {
	eg.variables["DSN"] = fmt.Sprintf("\"host=%s port=%s dbname=%s user=%s password=%s\"",
		eg.variables["DB_HOST"],
		eg.variables["DB_PORT"],
		eg.variables["DB_NAME"],
		eg.variables["POSTGRES_USER"],
		eg.variables["POSTGRES_PASSWORD"],
	)
}

func (eg *envGenerator) generateBackendEnv() {
	file := eg.forceCreateFile(eg.path + BackendEnv)
	defer file.Close()

	for _, key := range getBackendEnvKeys() {
		eg.writeVariable(key, file)
	}
}

func (eg *envGenerator) generateDockerComposeEnv() {
	file := eg.forceCreateFile(eg.path + DockerComposeEnv)
	defer file.Close()

	for _, key := range getDockerComposeEnvKeys() {
		eg.writeVariable(key, file)
	}
}

func (eg *envGenerator) forceCreateFile(path string) *os.File {
	file, err := os.Create(path)
	if err != nil {
		log.Fatal(err)
	}

	return file
}

func (eg *envGenerator) writeVariable(key string, file *os.File) {
	_, err := file.WriteString(fmt.Sprintf("%s=%s\n", key, eg.variables[key]))
	if err != nil {
		log.Fatal(err)
	}
}
