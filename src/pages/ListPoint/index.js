import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonGroup, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Menubar from "../../components/Menubar";
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import api from '../../services/api';
import { TOKEN_KEY } from '../../services/auth';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

import './styles.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Nome' },
  { id: 'email', numeric: false, disablePadding: false, label: 'E-mail' },
  { id: 'whatsapp', numeric: false, disablePadding: false, label: 'WhatsApp' },
  { id: 'city', numeric: false, disablePadding: false, label: 'Cidade' },
  { id: 'uf', numeric: false, disablePadding: false, label: 'Estado' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Ações' },
];

function ListPoint(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ListPoint.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  user: {
    fontSize: '12px',
    margin: '10px 0',
    color: 'black'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
    padding: '20px'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  formControl: {
    width: '40rem',
    margin: '40px auto',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [points, setPoints] = useState([]);
  const [isCollect, setIsCollect] = useState(false);
  const [user, setUser] = useState();
  const [select, setSelect] = useState(1);
  const alert = useAlert();
  const history = useHistory()

  useEffect(() => {
    async function getUser() {
      const config = {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem(TOKEN_KEY)
        }
      }
      const response = await api.get('/me', { ...config })
      setUser(response.data[0]);
    }
    getUser();
  }, [])

  useEffect(() => {
    async function getList() {
      if (user) {
        if (isCollect) {
          const response = await api.get(`user/list/${user.id}`)
          setPoints(response.data.collect);
        } else {
          const response = await api.get(`user/list/${user.id}`)
          setPoints(response.data.donate);
        }
      }
    }
    getList()
  }, [isCollect, user, points]);

  function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este ponto?")) {
      isCollect ?
        requestDelete(`/collect/${id}`)
        :
        requestDelete(`/donate/${id}`)
    }
  }

  async function requestDelete(url) {
    var result = await api.delete(url);
    if (result.status === 200) {
      history.push('/point/list');
      alert.show('Registro deletado com sucesso!', { type: 'success' })
    } else {
      alert.show('Ocorreu um erro. Por favor, tente novamente', { type: 'error' })
    }
  }

  function handleEdit(id) {
    isCollect ?
      history.push(`/edit/collect/${id}`) :
      history.push(`/edit/donate/${id}`)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = points.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleType = (event) => {
    setSelect(event.target.value);

    if (event.target.value === 0) {
      setIsCollect(true)
    } else {
      setIsCollect(false)
    }
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, points.length - page * rowsPerPage);

  return (
    <div id="page-list-point">
      <Menubar />
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer>
            <div className="list-toolbar">
              <h2>Pontos cadastrados por você</h2>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="select-label">Selecione o tipo do local</InputLabel>

                <Select
                  id="select"
                  labelId="select-label"
                  value={select}
                  onChange={handleType}
                >
                  <MenuItem value={0}>Coleta</MenuItem>
                  <MenuItem value={1}>Doação</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={'medium'}
              aria-label="enhanced table"
            >
              <ListPoint
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={points.length}
              />
              <TableBody>
                {stableSort(points, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell component="th" id={labelId} scope="row" >
                          {row.name}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.whatsapp}</TableCell>
                        <TableCell align="left">{row.city}</TableCell>
                        <TableCell align="left">{row.uf}</TableCell>
                        <TableCell align="left">
                          <ButtonGroup className="btn-action-list" variant="contained" aria-label="contained primary button group">
                            <Button
                              color="primary"
                              onClick={() => handleEdit(row.id)}>
                              Editar
                            </Button>
                            <Button
                              color="secondary"
                              onClick={() => handleDelete(row.id)}>
                              Deletar
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={points.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>

      </div>
    </div>
  );
}