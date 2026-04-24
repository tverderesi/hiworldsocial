import { useState, useContext } from "react";
import { useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;
  const { onChange, onSubmit, values } = useForm(loginUserCallback, { username: "", password: "" });

  const [loginUser, { loading }] = useMutation<any>(LOGIN_USER, {
    update(_, { data: { login: userData } }) { context.login(userData); navigate("/", { replace: true }); },
    onError(err: any) { setErrors(getGraphQLErrors(err)); },
    variables: values,
  });

  function loginUserCallback() { loginUser(); }

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <h1 className="page-title" style={{ marginBottom: "2em", marginTop: "1em" }}>Login</h1>
      <form onSubmit={onSubmit} noValidate style={{ width: "50%" }}>
        <div className="form-field"><label className="form-label">Username</label><Input placeholder="Username" name="username" value={values.username} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">Password</label><Input type="password" placeholder="Password" name="password" value={values.password} onChange={onChange} /></div>
        <Button type="submit" disabled={loading}>login</Button>
      </form>
      <p style={{ marginTop: "1em" }}><Link to="/forgot-password">Forgot your password?</Link></p>
      {errors && Object.keys(errors).length > 0 && <div className="error-message"><ul>{Object.values(errors).map((value: any) => <li key={value}>{value}</li>)}</ul></div>}
    </div>
  );
}
