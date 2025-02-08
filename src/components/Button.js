import { useRouter } from "next/router"

export default function Button( {text, route, className} ) {

  const router = useRouter()

  return (
    <button className={`${className} w-[90%] h-[2.3rem] rounded-md mb-1 hover:bg-shell`} onClick={() => router.push(route)}>
      {text}
    </button>
  )
}