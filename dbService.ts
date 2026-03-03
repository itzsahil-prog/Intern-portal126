
import { User, Task, Submission, Application, Message, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'velox_users',
  TASKS: 'velox_tasks',
  SUBMISSIONS: 'velox_submissions',
  APPLICATIONS: 'velox_applications',
  MESSAGES: 'velox_messages'
};

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = <T,>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  users: {
    get: () => getFromStorage<User[]>(STORAGE_KEYS.USERS, []),
    save: (users: User[]) => saveToStorage(STORAGE_KEYS.USERS, users),
    getById: (id: string) => getFromStorage<User[]>(STORAGE_KEYS.USERS, []).find(u => u.id === id),
    update: (updatedUser: User) => {
      const users = db.users.get();
      const idx = users.findIndex(u => u.id === updatedUser.id);
      if (idx > -1) {
        users[idx] = updatedUser;
        db.users.save(users);
      }
    }
  },
  tasks: {
    get: () => getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []),
    save: (tasks: Task[]) => saveToStorage(STORAGE_KEYS.TASKS, tasks),
    add: (task: Task) => {
      const tasks = db.tasks.get();
      tasks.push(task);
      db.tasks.save(tasks);
    }
  },
  submissions: {
    get: () => getFromStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, []),
    save: (submissions: Submission[]) => saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions),
    add: (submission: Submission) => {
      const subs = db.submissions.get();
      subs.push(submission);
      db.submissions.save(subs);
    },
    update: (updatedSub: Submission) => {
      const subs = db.submissions.get();
      const idx = subs.findIndex(s => s.id === updatedSub.id);
      if (idx > -1) {
        subs[idx] = updatedSub;
        db.submissions.save(subs);
      }
    }
  },
  applications: {
    get: () => getFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, []),
    save: (apps: Application[]) => saveToStorage(STORAGE_KEYS.APPLICATIONS, apps),
    add: (app: Application) => {
      const apps = db.applications.get();
      apps.push(app);
      db.applications.save(apps);
    },
    update: (updatedApp: Application) => {
      const apps = db.applications.get();
      const idx = apps.findIndex(a => a.id === updatedApp.id);
      if (idx > -1) {
        apps[idx] = updatedApp;
        db.applications.save(apps);
      }
    }
  },
  messages: {
    get: () => getFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, []),
    save: (messages: Message[]) => saveToStorage(STORAGE_KEYS.MESSAGES, messages),
    add: (message: Message) => {
      const msgs = db.messages.get();
      msgs.push(message);
      db.messages.save(msgs);
    },
    update: (updatedMsg: Message) => {
      const msgs = db.messages.get();
      const idx = msgs.findIndex(m => m.id === updatedMsg.id);
      if (idx > -1) {
        msgs[idx] = updatedMsg;
        db.messages.save(msgs);
      }
    }
  }
};

// Initial seeding
export const seedInitialData = () => {
  const users = db.users.get();
  // Clear existing to ensure the new admin is applied if needed, or check specific email
  const hasOfficialAdmin = users.some(u => u.email === 'veloxcodeagency@gmail.com');
  
  if (!hasOfficialAdmin) {
    db.users.save([
      {
        id: 'admin-main',
        name: 'VeloxCode Administrator',
        email: 'veloxcodeagency@gmail.com',
        password: 'admin',
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin-sahil',
        name: 'Sahil',
        email: 'sahil@veloxcode.com',
        password: 'itzsahil',
        role: UserRole.ADMIN,
        createdAt: new Date().toISOString()
      },
      {
        id: 'intern-demo',
        name: 'Demo Intern',
        email: 'intern@veloxcode.com',
        password: 'intern',
        role: UserRole.INTERN,
        createdAt: new Date().toISOString(),
        badges: ['fast-learner']
      }
    ]);
  }
  
  const tasks = db.tasks.get();
  if (tasks.length === 0) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    db.tasks.save([
      {
        id: 'task-1',
        title: 'System Architecture Design',
        description: 'Design the core architecture for the VeloxCode Agency main server. Focus on scalability, database relations, and API endpoints.',
        deadline: deadline.toISOString(),
        maxScore: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task-2',
        title: 'Agency UI Components',
        description: 'Develop a set of reusable React components following the brand guidelines. Ensure high accessibility and responsive design.',
        deadline: deadline.toISOString(),
        maxScore: 100,
        createdAt: new Date().toISOString()
      }
    ]);
  }
};
