export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const getInitials = (name = '') => {
    const parts = name.split(" ");
    let initials = "" ;
    for(let part of parts){
        initials += part.slice(0, 1);
    }

    return initials ;
}