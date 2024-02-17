import "./LogoBanner.scss"

function LogoBaner(props: { small?: boolean }) {
  const logo = <div><div class="img"></div></div>
  return (
    <div classList={{ "small": props.small ?? false }} id='logo-baner'>{logo}</div>
  )
}


export default LogoBaner;