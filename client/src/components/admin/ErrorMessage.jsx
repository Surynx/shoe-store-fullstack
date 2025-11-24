
function ErrorMessage({ elem }) {
  return (
    <p className="text-[11px] text-red-600 ml-2.5">{elem?.message ? `**${elem?.message}**` : null}</p>
  )
}

export default ErrorMessage