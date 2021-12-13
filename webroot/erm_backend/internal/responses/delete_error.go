package responses

type DeleteError struct {
	ErrorsCount int    `json:"-"`
	StatusCode  int    `json:"-"`
	Message     string `json:"message"`
}

func (e *DeleteError) AddError(message string, status int) {
	e.ErrorsCount++
	e.Message = message
	e.StatusCode = status
}
