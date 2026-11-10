import { body, validationResult } from 'express-validator';


export const registorValidator = [
    body('email')
        .exists().withMessage('Email is required').bail()
        .trim()
        .isEmail().withMessage('Enter a valid email address'),
    body('name')
        .exists().withMessage('Name is required').bail()
        .trim()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
    body('password')
        .exists().withMessage('Password is required').bail()
        .trim()
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            })
        }

        next()
    }
]

export const loginValidator = [
    body('email')
        .exists().withMessage('Email is required').bail()
        .isString().withMessage('Email must be a string').bail()
        .trim()
        .isEmail().withMessage('Enter a valid email address'),
    body('password')
        .exists().withMessage('Password is required').bail()
        .isString().withMessage('Password must be a string').bail()
        .trim()
        .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    (req, res, next)=>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            })
        }

        next()
    }
]