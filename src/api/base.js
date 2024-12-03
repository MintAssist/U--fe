const apiUrl = import.meta.env.VITE_API_URL;

function buildApi(path = "") {
	if (!path.startsWith("/")) {
		path = `/${path}`;
	}
	return `${apiUrl}${path}`;
}

const roles = [
	"user",
];

const accessTokenKey = "knfsAccessToken";
const currentUserKey = "currentUser";
const refreshTokenKey = "refreshToken";

const accessTokenKeyShare = import.meta.env.ACCESS_TOKEN_KEY_SHARE;
const refreshTokenKeyShare = import.meta.env.REFRESH_TOKEN_KEY_SHARE;



export { buildApi, roles, accessTokenKey, refreshTokenKey, currentUserKey, accessTokenKeyShare, refreshTokenKeyShare };
