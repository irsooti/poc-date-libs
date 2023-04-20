import { DateFns } from './Implementations/DateFns';
import { DayJs } from './Implementations/DayJs';
import { Luxon } from './Implementations/Luxon';

function App() {
  return (
    <div className="flex flex-col p-3 justify-center gap-3 bg-base-300 min-h-screen items-center">
      <DayJs />
      <Luxon />
      <DateFns />
    </div>
  )
}

export default App
