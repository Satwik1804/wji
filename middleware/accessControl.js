// import UAParser from 'ua-parser-js';
// import dotenv from "dotenv";

// dotenv.config();

// const accessControl = (req, res, next) => {
//     const userAgentString = req.headers['user-agent'];
//     const parser = new UAParser();
//     const agent = parser.setUA(userAgentString).getResult();

//     const isGoogleChrome = agent.browser.name === 'Chrome';
//     const isMobileDevice = agent.device.type === 'mobile';
//     const isOTPValidated = req.headers['x-otp-validated'] === process.env.HEADER;

//     req.deviceType = 'Other';

//     if (isMobileDevice) {
//         req.deviceType = 'Mobile';
//         const currentHour = new Date().getHours();
//         if (currentHour < 19 || currentHour > 23) {
//             return res.status(403).json({ message: "Access restricted for mobile devices outside 7 PM to 11 PM." });
//         }
//         else {
//             if (isGoogleChrome) {
//                 if (isOTPValidated) {
//                     return next();
//                 } else {
//                     return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true });
//                 }
//             } else {
//                 req.browserType = 'Other';
//                 return next();
//             }   
//         }
//     }

//     else {
//         if (isGoogleChrome) {
//             if (isOTPValidated) {
//                 return next();
//             } else {
//                 return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true });
//             }
//         } else {
//             req.browserType = 'Other';
//             return next();
//         }
//     }
// };

// export default accessControl;

import UAParser from 'ua-parser-js';
import dotenv from "dotenv";
import moment from 'moment-timezone';

dotenv.config();

const accessControl = (req, res, next) => {
    const userAgentString = req.headers['user-agent'];
    const parser = new UAParser();
    const agent = parser.setUA(userAgentString).getResult();

    const isGoogleChrome = agent.browser.name === 'Chrome';
    const isMobileDevice = agent.device.type === 'mobile';
    const isOTPValidated = req.headers['x-otp-validated'] === process.env.HEADER;
    const currentHour = moment().tz(req.headers['x-timezone'] || 'UTC').hour();

    req.deviceType = 'Other';

    if (isMobileDevice) {
        req.deviceType = 'Mobile';
        if (isGoogleChrome) {
            if (isOTPValidated) {
                return next();
            } else {
                console.log("currentHour " + currentHour)
                return res.status(401).json({ message: "OTP authentication required for Google Chrome users.", fromAccessControl: true });
            }
        } else {
            req.browserType = 'Other';
            return next();
        }
    }  
};

export default accessControl; 