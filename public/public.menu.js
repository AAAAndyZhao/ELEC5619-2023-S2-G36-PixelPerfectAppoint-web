/*
Rules:
1. All menu should be defined here
2. All menu should be defined as array
3. All menu should be defined as object with code and value
*/
$MENU = {
    /*
    Multiple choice menu
    */
    "USER_PROFESSIONAL": [{
        code: 0,
        value: 'Model'
    }, {
        code: 1,
        value: 'Photographer'
    }, {
        code: 2,
        value: 'Others'
    }],
    "USER_GENDER": [{
        code: 0,
        value: 'Male'
    }, {
        code: 1,
        value: 'Female'
    }, {
        code: 2,
        value: 'Prefer not to disclose'
    }],
    "PHOTO_CATEGORY": [{
        code: 0,
        value: 'Uncategorized'
    }, {
        code: 1,
        value: 'Landscape'
    }, {
        code: 2,
        value: 'Portrait'
    }],
    "CAM_MAKER": [{
        code: 0,
        value: 'Canon'
    }, {
        code: 1,
        value: 'Nikon'
    }, {
        code: 2,
        value: 'Sony'
    }, {
        code: 3,
        value: 'Fujifilm'
    }, {
        code: 4,
        value: 'Olympus'
    }, {
        code: 5,
        value: 'Panasonic'
    }, {
        code: 6,
        value: 'Leica'
    }, {
        code: 7,
        value: 'Sigma'
    }, {
        code: 8,
        value: 'Pentax'
    }, {
        code: 9,
        value: 'Hasselblad'
    }, {
        code: 10,
        value: 'Samsung'
    }, {
        code: 11,
        value: 'Kodak'
    }, {
        code: 12,
        value: 'Ricoh'
    }, {
        code: 13,
        value: 'Phase One'
    }, {
        code: 14,
        value: 'Casio'
    }, {
        code: 15,
        value: 'Other'
    }],
    "APPOINTMENT_STATUS": [{
        code: 0,
        value: 'CREATED',
        tagType: ''
    }, {
        code: 1,
        value: 'ALL ACCEPTED',
        tagType: ''
    }, {
        code: 2,
        value: 'COMPLETED',
        tagType: 'success'
    }, {
        code: 3,
        value: 'CANCELLED',
        tagType: 'info'
    }],
    "APPOINTMENT_PARTICIPANT_STATUS": [{
        code: 0,
        value: 'PENDING',
        tagType: ''
    }, {
        code: 1,
        value: 'ACCEPTED',
        tagType: 'success'
    }, {
        code: 2,
        value: 'REJECTED',
        tagType: 'danger'
    }],
    "APPOINTMENT_PARTICIPANT_ROLE": [{
        code: 0,
        value: 'Role Not Assigned',
        tagType: 'info'
    }, {
        code: 1,
        value: 'Photographer',
        tagType: ''
    }, {
        code: 2,
        value: 'Model',
        tagType: 'success'
    }, {
        code: 3,
        value: 'Helper',
        tagType: 'warning'
    }]
}