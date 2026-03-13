import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getRecentCalls, callTypeNames, type CallType } from '../data/calls';

const CALL_BORDER: Record<CallType, string> = {
  acdc:  'border-l-blue-500 dark:border-l-blue-400',
  acde:  'border-l-sky-500 dark:border-l-sky-400',
  acdt:  'border-l-cyan-500 dark:border-l-cyan-400',
  epbs:  'border-l-amber-500 dark:border-l-amber-400',
  bal:   'border-l-red-500 dark:border-l-red-400',
  focil: 'border-l-orange-500 dark:border-l-orange-400',
  price: 'border-l-rose-500 dark:border-l-rose-400',
  tli:   'border-l-pink-500 dark:border-l-pink-400',
  pqts:  'border-l-yellow-500 dark:border-l-yellow-400',
  rpc:   'border-l-violet-500 dark:border-l-violet-400',
  zkevm: 'border-l-fuchsia-500 dark:border-l-fuchsia-400',
  etm:   'border-l-purple-500 dark:border-l-purple-400',
  awd:   'border-l-lime-500 dark:border-l-lime-400',
  pqi:   'border-l-emerald-500 dark:border-l-emerald-400',
};

const CALL_BADGE: Record<CallType, string> = {
  acdc:  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  acde:  'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  acdt:  'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  epbs:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  bal:   'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  focil: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  price: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  tli:   'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  pqts:  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  rpc:   'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  zkevm: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300',
  etm:   'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  awd:   'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
  pqi:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
};

function formatDate(dateStr: string, language: 'zh' | 'en') {
  const d = new Date(dateStr + 'T00:00:00');
  return language === 'zh'
    ? d.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

interface Props {
  language: 'zh' | 'en';
  darkMode: boolean;
}

const RecentProtocolCalls = ({ language, darkMode }: Props) => {
  const calls = getRecentCalls(5);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          {language === 'zh' ? '最近的協議會議' : 'Recent Protocol Calls'}
        </h3>
        <Link
          to="/calls"
          className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          {language === 'zh' ? '查看全部' : 'View all'}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {calls.map(call => (
          <Link
            key={call.path}
            to={`/calls/${call.path}`}
            className={`flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 hover:shadow-sm dark:hover:shadow-slate-700/20 transition-all hover:border-slate-300 dark:hover:border-slate-600 border-l-4 ${CALL_BORDER[call.type]}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 min-w-[3.5rem] text-center ${CALL_BADGE[call.type]}`}>
                {call.type.toUpperCase()}
              </span>
              <span className={`text-sm font-medium truncate ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {callTypeNames[call.type]}
              </span>
              <span className={`text-sm flex-shrink-0 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                #{call.number}
              </span>
            </div>
            <span className={`text-xs flex-shrink-0 ml-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {formatDate(call.date, language)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentProtocolCalls;
