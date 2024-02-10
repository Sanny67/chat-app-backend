import jwt from 'jsonwebtoken';

export const generate_token = (payload, expiresIn = "30d") => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export const verify_token = (token) => {
    const is_active = jwt.verify(token, process.env.JWT_SECRET);
    if (!is_active) return false;

    return jwt.decode(token);
}