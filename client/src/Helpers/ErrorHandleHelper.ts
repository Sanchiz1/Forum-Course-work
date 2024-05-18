export const ReturnErrorMessage = (messages: [String], errorMessage: String) => {

    let result: String = "Something went wrong, we are working fixing the problem."
    messages.forEach(message => {
        if(errorMessage === message){
            result = message;
        }
    });

    return result
}