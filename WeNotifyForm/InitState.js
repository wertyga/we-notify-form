//Initialize state

export default {
    parentNode: document.getElementById('app'),
    sendData: {
        url: '/submit',
        method: 'post'
    },
    header: 'Submit form',
    content: {

    },
    inputs: [
        {
            name: 'username',
            placeholder: 'Username...',
            label: 'Username'
        },
        {
            name: 'message',
            type: 'textarea',
            placeholder: 'Message...',
            label: 'Message'
        }
    ],
    submitButton: {
        name: 'submit',
        type: 'submit',
        label: 'Submit',
    },
    buttons: [],
}