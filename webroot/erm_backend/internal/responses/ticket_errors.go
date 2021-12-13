package responses

type TicketDeleteError struct {
	ErrorsCount int    `json:"-"`
	StatusCode  int    `json:"-"`
	Message     string `json:"message"`
}

func (e *TicketDeleteError) AddError(message string, status int) {
	e.ErrorsCount++
	e.Message = message
	e.StatusCode = status
}
