import Vue from 'vue';
import {
  Input,
  Button,
  Form,
  FormItem,
  Container,
  Message,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  RadioGroup,
  RadioButton,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Col,
  Row,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox
} from 'element-ui';

Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Col);
Vue.use(Row);
Vue.use(Card);
Vue.use(BreadcrumbItem);
Vue.use(Breadcrumb);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Main);
Vue.use(Aside);
Vue.use(Header);

//注册全局方法
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;