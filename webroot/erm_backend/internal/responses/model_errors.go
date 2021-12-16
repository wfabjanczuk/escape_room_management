package responses

type ModelErrors interface {
	AddError(key, message string, status int)
}
