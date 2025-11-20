import { NavLink } from "react-router-dom";

function Breadcrumb({ location,product }) {
  const endpath = location.split("/");

  let fullpath="";

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <NavLink to={"/"} className="hover:underline">
        Home
      </NavLink>
      {endpath.map((path,i) => {

        if (path && path != "product") {

          fullpath += `/${path}`;

          return (
            <div key={i}>
              <span>/ </span>
              <NavLink
                to={path == product?._id ? null : fullpath}
                className="hover:underline font-medium text-black"
              >
                {path == product?._id ? product.name : path} 
              </NavLink>
            </div>
          );
        }
      })}
    </div>
  );
}

export default Breadcrumb;
