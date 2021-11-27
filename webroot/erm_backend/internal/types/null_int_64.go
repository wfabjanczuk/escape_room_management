package types

import (
	"database/sql"
	"encoding/json"
	"strconv"
)

type NullInt64 struct {
	sql.NullInt64
}

func (ni NullInt64) MarshalJSON() ([]byte, error) {
	if !ni.Valid {
		return []byte("null"), nil
	}

	return json.Marshal(&ni.Int64)
}

func (ni *NullInt64) UnmarshalJSON(data []byte) error {
	if "null" == string(data) {
		*ni = NullInt64{
			sql.NullInt64{
				Valid: false,
				Int64: 0,
			},
		}

		return nil
	}

	number, err := strconv.Atoi(string(data))
	if err != nil {
		return err
	}

	*ni = NullInt64{
		sql.NullInt64{
			Valid: true,
			Int64: int64(number),
		},
	}

	return nil
}
