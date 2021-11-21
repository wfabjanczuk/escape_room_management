exports.showGuestList = (req, res, next) => {
    res.render('pages/guest/list', {navLocation: 'guests'});
}

exports.showAddGuestForm = (req, res, next) => {
    res.render('pages/guest/form', {navLocation: 'guests'});
}

exports.showEditGuestForm = (req, res, next) => {
    res.render('pages/guest/form-edit', {navLocation: 'guests'});
}

exports.showGuestDetails = (req, res, next) => {
    res.render('pages/guest/details', {navLocation: 'guests'});
}