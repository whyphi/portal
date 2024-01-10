'use client'

interface ListingRowProps {
  listingId: string;
  title: string;
  active: boolean;
  dateCreated: string;
  deadline: string;
  applicantCount: number;
}

export default function ListingRow({ listingId, title, active, deadline, dateCreated, applicantCount }: ListingRowProps) {
  return (
    <div id={listingId} className="flex py-2 h-24 border-b-2 cursor-pointer">
      <ActiveIndicator active={active}/>
      <div className='flex flex-col w-60 justify-between'>
        <p className="text-lg font-medium truncate">{title}</p>
        <div>
          <p className="text-sm text-slate-400">Deadline: {convertDateTime(deadline)}</p>
          <p className="text-sm text-slate-400">Created: {convertDateTime(dateCreated)}</p>
        </div>
      </div>
      <ApplicantCounter count={applicantCount}/>
    </div>
  )
}


const ActiveIndicator = ({ active }: { active: boolean }) => {
  return (
    <div className="flex flex-row">
      <span className={`flex w-3 h-3 rounded-full m-2 ${active ? 'bg-green-500' : 'bg-red-500'}`}></span>
    </div>
  );
};


const ApplicantCounter = ({count}: {count: number}) => {
  return (
    <div className="bg-emerald-100 h-7 rounded">
      <p className="text-xl font-bold text-emerald-700 px-1">{count}</p>
    </div>
  )
}

const convertDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
