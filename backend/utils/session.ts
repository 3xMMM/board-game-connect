import { Session, SessionData } from 'express-session';

export type AppSessionType = Session & Partial<SessionData>;

export const AppSession = {
    regenerate: (session: AppSessionType, userId: number, username: string): void => {
        session.regenerate((err) => {
            if (err) throw new Error('Could not regenerate session');

            session.userId = userId;
            session.username = username;
            session.save((err) => {
                if (err) throw new Error('Could not save session');
            });
        });
    },
    /**
     * Clears the Session, saves it, and regenerates a new Session to kill the old one.
     * Used when you want to log out a user/invalid their session. They will need to
     * log in again afterwards.
     */
    clear: (session: AppSessionType, callback: Function): void => {
        // clear the user from the session object and save.
        // this will ensure that re-using the old session id
        // does not have a logged-in user
        session.userId = null;
        session.username = '';
        session.save((err) => {
            if (err) throw new Error('Could not clear and save session');

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            session.regenerate((err) => {
                if (err) throw new Error('Could not regenerate session during clearing');
                callback();
            });
        });
    },
};

export default AppSession;
