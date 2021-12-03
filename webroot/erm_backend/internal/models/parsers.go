package models

import (
	"database/sql"
	"erm_backend/internal/constants"
	"erm_backend/internal/types"
	"strconv"
	"time"
)

func ParseGuest(payload types.GuestPayload, parseId bool) (Guest, error) {
	var guest Guest

	if parseId {
		id, err := strconv.Atoi(payload.Id)
		if err != nil {
			return guest, err
		}

		guest.Id = uint(id)
	}

	guest.Email = payload.Email
	guest.FirstName = payload.FirstName
	guest.LastName = payload.LastName
	guest.PhoneNumber = payload.PhoneNumber

	dateBirth, err := time.Parse(constants.DefaultDateFormat, payload.DateBirth)
	if err != nil {
		return guest, err
	}
	guest.DateBirth = types.Date{
		dateBirth,
	}

	if len(payload.DiscountPercent) > 0 {
		discountPercent, err := strconv.Atoi(payload.DiscountPercent)
		if err != nil {
			return guest, err
		}

		guest.DiscountPercent = types.NullInt64{
			sql.NullInt64{
				Int64: int64(discountPercent),
				Valid: true,
			},
		}
	} else {
		guest.DiscountPercent = types.NullInt64{
			sql.NullInt64{
				Int64: 0,
				Valid: false,
			},
		}
	}

	return guest, nil
}
