package parsers

import (
	"erm_backend/internal/responses"
	"fmt"
	"net/http"
	"strings"
	"unicode"
)

func parseStructError(err error, modelErrors responses.ModelErrors) {
	errorSlice := strings.Split(err.Error(), ";")

	for _, fieldError := range errorSlice {
		errorParts := strings.Split(fieldError, ":")
		key := getFieldBaseName(errorParts[0])
		message := transformErrorMessage(strings.TrimSpace(errorParts[1]))

		modelErrors.AddError(key, message, http.StatusBadRequest)
	}
}

func getFieldBaseName(fieldName string) string {
	fieldNameParts := strings.Split(fieldName, ".")

	baseName := []rune(fieldNameParts[len(fieldNameParts)-1])
	baseName[0] = unicode.ToLower(baseName[0])

	return string(baseName)
}

func transformErrorMessage(message string) string {
	if message == "non zero value required" {
		return "This field is required."
	}

	messageParts := strings.Split(message, "does not validate as ")
	validatorType := messageParts[len(messageParts)-1]
	validatorTypeParts := strings.Split(validatorType, "(")
	parameter := ""

	if len(validatorTypeParts) > 1 {
		validatorType = validatorTypeParts[0]
		parameter = strings.TrimRight(validatorTypeParts[1], ")")
	}

	switch validatorType {
	case "email":
		return "This field must be a valid email address."
	case "utfletter":
		return "Only letters allowed."
	case "utfdigit":
		return "Only digits allowed."
	case "minstringlength":
		return fmt.Sprintf("Minimum length is %s.", parameter)
	case "maxstringlength":
		return fmt.Sprintf("Maximum length is %s.", parameter)
	}

	return "Invalid field data"
}
