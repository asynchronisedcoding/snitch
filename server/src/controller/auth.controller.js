import usermodel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
    createAccessToken,
    createRefreshToken,
    readRefreshToken,
} from "../utils/auth.utils.js";

export async function register(req, res) {
    const { email, name, password } = req.body;

    const isUserAlreadyExist = await usermodel.findOne({
        email
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: 'User already exists',
            errors: [{
                field: "email",
                msg: "User already exists",
            }],
        });
    }

    const user = await usermodel.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password, 12)
    })

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })


    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
    })


    await usermodel.findByIdAndUpdate(user._id, {
        refreshToken
    })

    res.status(201).json({
        message: 'User created successfully',
        data: {
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
            },
            accessToken
        }
    })
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await usermodel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: 'invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        res.status(400).json({
            message: 'invalid email or password'
        })
    }

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })

    await usermodel.findOneAndUpdate({
        email
    }, {
        refreshToken
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
    })

    res.status(200).json({
        message: 'User logged in successfully',
        data: {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            accessToken
        }
    })
}

export async function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required",
        });
    }
    let decoded;
    try {
        decoded = readRefreshToken(refreshToken);
    } catch {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }

    const user = await usermodel.findById(decoded.userId);

    if (refreshToken != user.refreshToken) {
        return res.status(401).json({
            message: "Refresh token mismatch",
        });
    }

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role,
    });
    const newRefreshToken = createRefreshToken({
        userId: user._id,
        role: user.role,
    });

    await usermodel.findByIdAndUpdate(user._id, {
        refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
    });

    return res.status(200).json({
        message: "Token rotated successfully",
        data: {
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
            },
            accessToken,
        },
    });
}

export async function getMe(req, res) {
    const { userId, role } = req.user;

    const user = await usermodel.findById(userId);
    res.status(200).json({
        message: 'User fetched successfully',
        data:{
            user:{
                email: user.email,
                name: user.name,
                id: user._id,
            }
        }
    })
}