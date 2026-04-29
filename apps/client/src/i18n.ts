import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import moment from "moment";
import "moment/dist/locale/pt-br";

export const LANGUAGE_STORAGE_KEY = "hiworld.preferredLanguage";
export const SUPPORTED_LANGUAGES = ["en", "pt"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function normalizeLanguage(language?: string | null): SupportedLanguage | null {
  const normalized = language?.toLowerCase().split("-")[0];
  return normalized === "pt" || normalized === "en" ? normalized : null;
}

export function getStoredLanguage(): SupportedLanguage | null {
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getOsLanguage(): SupportedLanguage {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.map(normalizeLanguage).find(Boolean) ?? "en";
}

export function setPreferredLanguage(language: SupportedLanguage) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  void i18n.changeLanguage(language);
}

function setMomentLocale(language: SupportedLanguage) {
  moment.locale(language === "pt" ? "pt-br" : "en");
}

const resources = {
  en: {
    translation: {
      actions: {
        addComment: "Add Comment",
        backToLogin: "Back to login",
        cancel: "Cancel",
        confirm: "Confirm",
        commentOnPost: "Comment on post",
        editProfile: "Edit Profile",
        goToLogin: "Go to login",
        login: "login",
        logout: "logout",
        likePost: "Like Post",
        register: "register",
        resetPassword: "Reset Password",
        saveChanges: "Save Changes",
        send: "Send",
        sendResetLink: "Send Reset Link",
      },
      comments: {
        count_one: "{{count}} Comment",
        count_other: "{{count}} Comments",
      },
      common: {
        email: "E-mail",
        error: "Error: {{message}}",
        loading: "Loading...",
        password: "Password",
        username: "Username",
      },
      dialogs: {
        deleteComment: "Delete comment",
        deletePost: "Delete post",
        destructiveDescription: "This action cannot be undone.",
      },
      forgotPassword: {
        checkEmail: "Check your email",
        description: "Enter your email address and, if an account exists, you'll receive a password reset link.",
        title: "Forgot Password",
      },
      home: {
        loadingPosts: "Loading posts",
        recentPosts: "Recent Posts",
      },
      languages: {
        en: "English",
        label: "Language",
        pt: "Portuguese",
      },
      likes: {
        and: "and",
        likedBy: "{{names}} liked this.",
        likedThisPlural: "liked this.",
        likedThisSingular: "liked this.",
        nobody: "Nobody Liked This",
        others_one: "{{count}} other person",
        others_other: "{{count}} other people",
        you: "You",
        youLiked: "You liked this.",
      },
      newComment: {
        error: "Could not add comment.",
        placeholder: "Add your comment",
      },
      newPost: {
        errorSuffix: "!",
        placeholder: "Say hi to the World!",
        title: "New Post",
      },
      profile: {
        selectAvatar: "Select an Avatar",
        selectNewAvatar: "Select a new Avatar",
        joined: "Joined {{time}}",
      },
      profileForm: {
        confirmNewPassword: "Confirm New Password",
        newPassword: "New Password",
        newUsername: "New Username (Leave Blank if you don't want to change it)",
        oldPassword: "Old Password",
        title: "Edit Profile",
      },
      register: {
        confirmPassword: "Confirm Password",
        title: "Register",
      },
      resetPassword: {
        invalidToken: "Reset link is invalid or expired.",
        passwordUpdated: "Password updated",
        title: "Reset Password",
      },
      singlePost: {
        loading: "Loading post",
        notFound: "Error! No post could be found.",
      },
      welcome: {
        ad: "See what our users are talking about right now!",
      },
    },
  },
  pt: {
    translation: {
      actions: {
        addComment: "Adicionar comentario",
        backToLogin: "Voltar ao login",
        cancel: "Cancelar",
        confirm: "Confirmar",
        commentOnPost: "Comentar na publicacao",
        editProfile: "Editar perfil",
        goToLogin: "Ir para o login",
        login: "entrar",
        logout: "sair",
        likePost: "Curtir publicacao",
        register: "cadastrar",
        resetPassword: "Redefinir senha",
        saveChanges: "Salvar alteracoes",
        send: "Enviar",
        sendResetLink: "Enviar link de redefinicao",
      },
      comments: {
        count_one: "{{count}} Comentario",
        count_other: "{{count}} Comentarios",
      },
      common: {
        email: "E-mail",
        error: "Erro: {{message}}",
        loading: "Carregando...",
        password: "Senha",
        username: "Nome de usuario",
      },
      dialogs: {
        deleteComment: "Excluir comentario",
        deletePost: "Excluir publicacao",
        destructiveDescription: "Esta acao nao pode ser desfeita.",
      },
      forgotPassword: {
        checkEmail: "Verifique seu e-mail",
        description: "Informe seu e-mail e, se existir uma conta, voce recebera um link para redefinir a senha.",
        title: "Esqueci minha senha",
      },
      home: {
        loadingPosts: "Carregando publicacoes",
        recentPosts: "Publicacoes recentes",
      },
      languages: {
        en: "Ingles",
        label: "Idioma",
        pt: "Portugues",
      },
      likes: {
        and: "e",
        likedBy: "{{names}} curtiram isto.",
        likedThisPlural: "curtiram isto.",
        likedThisSingular: "curtiu isto.",
        nobody: "Ninguem curtiu isto",
        others_one: "{{count}} outra pessoa",
        others_other: "{{count}} outras pessoas",
        you: "Voce",
        youLiked: "Voce curtiu isto.",
      },
      newComment: {
        error: "Nao foi possivel adicionar o comentario.",
        placeholder: "Adicione seu comentario",
      },
      newPost: {
        errorSuffix: "!",
        placeholder: "Diga oi ao mundo!",
        title: "Nova publicacao",
      },
      profile: {
        selectAvatar: "Selecione um avatar",
        selectNewAvatar: "Selecione um novo avatar",
        joined: "Entrou {{time}}",
      },
      profileForm: {
        confirmNewPassword: "Confirmar nova senha",
        newPassword: "Nova senha",
        newUsername: "Novo nome de usuario (deixe em branco se nao quiser alterar)",
        oldPassword: "Senha atual",
        title: "Editar perfil",
      },
      register: {
        confirmPassword: "Confirmar senha",
        title: "Cadastro",
      },
      resetPassword: {
        invalidToken: "O link de redefinicao e invalido ou expirou.",
        passwordUpdated: "Senha atualizada",
        title: "Redefinir senha",
      },
      singlePost: {
        loading: "Carregando publicacao",
        notFound: "Erro! Nenhuma publicacao foi encontrada.",
      },
      welcome: {
        ad: "Veja o que nossos usuarios estao falando agora!",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  lng: getStoredLanguage() ?? getOsLanguage(),
  react: {
    useSuspense: false,
  },
  resources,
});

setMomentLocale(i18n.language === "pt" ? "pt" : "en");
i18n.on("languageChanged", (language) => {
  setMomentLocale(language === "pt" ? "pt" : "en");
});

export default i18n;
