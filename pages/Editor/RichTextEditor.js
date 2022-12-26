import dynamic from 'next/dynamic'
// import NoSSR from 'react-no-ssr';
// import CreatePages from '../Dashboard/AdminDashboard/CreatePages'
const ComponentWithNoSSR = dynamic(
  () => import('../Dashboard/AdminDashboard/CreatePages'),
  { ssr: false }
)

// function RichTextEditor() {

//   return (
//     <div>   
//      <ComponentWithNoSSR/>
//      </div>
//   )
// }

export default ComponentWithNoSSR