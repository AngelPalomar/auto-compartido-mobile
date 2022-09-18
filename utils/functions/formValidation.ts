export function emailValidation(correoElectronico: string): boolean {
    const emailValid = /^([a-zA-Z0-9_.])+@(([a-zA-Z0-9])+\.)+([a-zA-Z0-9]{2,4})+$/;

    const resultValidation = emailValid.test(correoElectronico);

    if (resultValidation)
        return true;
    else
        return false;
}

export function minLenghtValidation(data: string, minLength: number): boolean {
    if (data.length >= minLength)
        return true;
    else
        return false;
}