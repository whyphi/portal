"use client";

export default function ListingView() {
  return (
    <div className="flex pt-3 h-100">
      <div>
        <ListingRow/>
        <ListingRow/>
        <ListingRow/>
        <ListingRow/>
      </div>
      <div>
        Test
      </div>
    </div>
  )
}

const ListingRow = () => {
  return (
    <div className="flex p-1 border-b-2">
      <ActiveIndicator active={true}/>
      <div className='flex-col justify-between'>
        <p className="text-lg font-medium">Spring 2024 Rush Application</p>
        <p className="text-sm text-slate-400">Deadline: Aug-12-2024</p>
        <p className="text-sm text-slate-400">Created: Dec-25-2023</p>
      </div>
      <ApplicantCounter/>
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


const ApplicantCounter = () => {
  return (
    <div className="bg-emerald-100 h-7 rounded">
      <p className="text-xl font-bold text-emerald-700 px-1">12</p>
    </div>
  )
}