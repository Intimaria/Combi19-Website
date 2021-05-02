import styles, {globals} from "../styles/"

export default function AppLayout({children}) {
return (
 <div>
	 <div>
		<main>{children}</main>
	 </div>
	 <style jsx>{styles}</style>
	 <style jsx global>
		{globals}
	 </style>
 </div>

)}
