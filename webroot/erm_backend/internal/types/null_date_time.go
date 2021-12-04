package types

import (
	"database/sql"
	"encoding/json"
	"erm_backend/internal/constants"
	"time"
)

type NullDateTime struct {
	sql.NullTime
}

func (ndt NullDateTime) MarshalJSON() ([]byte, error) {
	if !ndt.NullTime.Valid {
		return []byte("null"), nil
	}

	return json.Marshal(ndt.NullTime.Time.Format(constants.DefaultDateTimeFormat))
}

func (ndt *NullDateTime) UnmarshalJSON(data []byte) error {
	if "null" == string(data) {
		*ndt = NullDateTime{
			NullTime: sql.NullTime{
				Valid: false,
			},
		}

		return nil
	}

	parsedTime, err := time.Parse(constants.DefaultDateTimeFormat, string(data))
	if err != nil {
		return err
	}

	*ndt = NullDateTime{
		NullTime: sql.NullTime{
			Valid: true,
			Time:  parsedTime,
		},
	}

	return nil
}
