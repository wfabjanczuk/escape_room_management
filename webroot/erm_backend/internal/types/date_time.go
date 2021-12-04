package types

import (
	"database/sql/driver"
	"encoding/json"
	"erm_backend/internal/constants"
	"fmt"
	"time"
)

type DateTime struct {
	time.Time
}

func (dt DateTime) MarshalJSON() ([]byte, error) {
	return json.Marshal(dt.Time.Format(constants.DefaultDateTimeFormat))
}

func (dt *DateTime) UnmarshalJSON(data []byte) error {
	parsedTime, err := time.Parse(constants.DefaultDateTimeFormat, string(data))
	if err != nil {
		return err
	}

	*dt = DateTime{
		Time: parsedTime,
	}

	return nil
}

func (dt *DateTime) Scan(value interface{}) error {
	switch source := value.(type) {
	case time.Time:
		dt.Time = source
	default:
		return fmt.Errorf("unsupported scan type %T", value)
	}
	return nil
}

func (dt DateTime) Value() (driver.Value, error) {
	if dt.Time.IsZero() {
		return nil, nil
	}

	return dt.Time.Format(constants.DefaultDateTimeFormat), nil
}
