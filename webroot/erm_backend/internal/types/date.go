package types

import (
	"database/sql/driver"
	"encoding/json"
	"erm_backend/internal/constants"
	"fmt"
	"time"
)

type Date struct {
	time.Time
}

func (d Date) MarshalJSON() ([]byte, error) {
	return json.Marshal(d.Format(constants.DefaultDateFormat))
}

func (d *Date) UnmarshalJSON(data []byte) error {
	parsedTime, err := time.Parse(constants.DefaultDateFormat, string(data))
	if err != nil {
		return err
	}

	*d = Date{
		parsedTime,
	}

	return nil
}

func (d *Date) Scan(value interface{}) error {
	switch source := value.(type) {
	case time.Time:
		d.Time = source
	default:
		return fmt.Errorf("unsupported scan type %T", value)
	}
	return nil
}

func (d Date) Value() (driver.Value, error) {
	if d.Time.IsZero() {
		return nil, nil
	}

	return d.Time.Format(constants.DefaultDateFormat), nil
}
