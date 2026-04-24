import { useState, useContext } from "react";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER_MUTATION } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export function EditProfile() {
  const navigate = useNavigate();
  const context = useContext(AuthContext) as any;
  const user = context.user;
  const initialState: any = { oldUsername: user.username, newUsername: "", email: user.email, oldPassword: "", newPassword: "", confirmPassword: "", profilePicture: user.profilePicture };
  const { onChange, onSubmit, values } = useForm(updateUser, initialState);
  const [errors, setErrors] = useState({}) as any;
  const [changeUser, { loading }] = useMutation<any>(UPDATE_USER_MUTATION, {
    update(_, { data: { updateUser: userData } }) { context.login(userData); navigate("/", { replace: true }); },
    onError(err) { setErrors(getGraphQLErrors(err)); },
    variables: { updateProfileInput: values },
  });
  function updateUser() { changeUser(); }

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div className="page-shell" style={{ maxWidth: 600 }}>
      <h1>Edit Profile</h1>
      {Object.keys(errors)?.length > 0 && <div className="error-message"><ul>{Object.values(errors).map((value: any) => <li key={value}>{value}</li>)}</ul></div>}
      <form onSubmit={onSubmit}>
        <div className="form-field"><label className="form-label">New Username (Leave Blank if you don't want to change it)</label><Input name="newUsername" placeholder="Username" value={values.newUsername} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">Email</label><Input placeholder="email" name="email" value={values.email} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">Old Password</label><Input name="oldPassword" type="password" placeholder="Password" value={values.oldPassword} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">New Password</label><Input name="newPassword" type="password" placeholder="Password" value={values.newPassword} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">Confirm New Password</label><Input type="password" placeholder="Password" name="confirmPassword" value={values.confirmPassword} onChange={onChange} /></div>
        <ProfilePictureSelector values={values} update />
        <div style={{ display: "grid", justifyContent: "center", margin: "1rem 0" }}><Button type="submit">Save Changes</Button></div>
      </form>
    </div>
  );
}
